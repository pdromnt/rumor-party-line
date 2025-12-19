package main

import (
	"bufio"
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

var (
	cancelFunc context.CancelFunc
	mu         sync.Mutex
)

// Join performs the initial check via GET /joinPartyLine
func Join(instanceURL, partyLine string) error {
	baseURL, err := parseURL(instanceURL)
	if err != nil {
		return err
	}

	joinURL := fmt.Sprintf("%s/joinPartyLine?partyLine=%s", baseURL, url.QueryEscape(partyLine))
	resp, err := http.Get(joinURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to join: status %s", resp.Status)
	}

	return nil
}

// Connect starts the SSE connection to /connectPartyLine
func Connect(instanceURL, partyLine string, onMessage func(string), onError func(error)) {
	Disconnect() // Ensure previous is killed

	mu.Lock()
	ctx, cancel := context.WithCancel(context.Background())
	cancelFunc = cancel
	mu.Unlock()

	go func() {
		baseURL, err := parseURL(instanceURL)
		if err != nil {
			onError(err)
			return
		}

		connectURL := fmt.Sprintf("%s/connectPartyLine?partyLine=%s", baseURL, url.QueryEscape(partyLine))

		// Retry loop
		for {
			select {
			case <-ctx.Done():
				return
			default:
				if err := streamSSE(ctx, connectURL, onMessage); err != nil {
					// Only report/retry if not cancelled
					if ctx.Err() == nil {
						onError(err)
						time.Sleep(5 * time.Second) // Retry delay
					}
				}
			}
		}
	}()
}

func Disconnect() {
	mu.Lock()
	defer mu.Unlock()
	if cancelFunc != nil {
		cancelFunc()
		cancelFunc = nil
	}
}

func streamSSE(ctx context.Context, url string, onMessage func(string)) error {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return err
	}

	req.Header.Set("Accept", "text/event-stream")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("SSE connection failed: %s", resp.Status)
	}

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "data:") {
			msg := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
			if msg != "" {
				onMessage(msg)
			}
		}
	}

	return scanner.Err()
}

func parseURL(rawURL string) (string, error) {
	u, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	// Basic cleanup, remove trailing slash
	return strings.TrimRight(u.String(), "/"), nil
}
