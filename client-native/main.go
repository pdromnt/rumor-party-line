package main

import (
	"fmt"
	"log"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/driver/desktop"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
	"fyne.io/systray"
)

func main() {
	// 1. Initialize App with ID
	a := app.NewWithID("com.rumor.partyline")

	// 2. Load Settings
	config, err := LoadSettings()
	if err != nil {
		log.Println("Error loading settings:", err)
		config = &Config{}
	}

	// 3. Tray Setup
	if desk, ok := a.(desktop.App); ok {
		menu := fyne.NewMenu("Rumor Party Line",
			fyne.NewMenuItem("Settings", func() {
				w := CreateSettingsWindow(a, config, lastReceivedRumor, func(newConfig Config) {
					*config = newConfig
					SaveSettings(config)
					handleConnection(a, config)
				})
				w.Show()
			}),
		)
		desk.SetSystemTrayMenu(menu)
		desk.SetSystemTrayIcon(theme.MailComposeIcon())
		systray.SetTooltip("Rumor Party Line")
	}

	// 4. Initial Connection Attempt
	if config.InstanceURL != "" && config.PartyLine != "" {
		handleConnection(a, config)
	} else {
		// Open settings if no config
		w := CreateSettingsWindow(a, config, lastReceivedRumor, func(newConfig Config) {
			*config = newConfig
			SaveSettings(config)
			handleConnection(a, config)
		})
		w.Show()
	}

	a.Run()
}

var lastReceivedRumor string

func handleConnection(a fyne.App, config *Config) {
	// Disconnect existing
	Disconnect()

	// Validate basics
	if config.InstanceURL == "" || config.PartyLine == "" {
		return
	}

	// 1. Join
	err := Join(config.InstanceURL, config.PartyLine)
	if err != nil {
		// Show error in a dialog/window
		w := a.NewWindow("Connection Failed")
		w.SetContent(widget.NewLabel(fmt.Sprintf("Could not join Party Line. Check your settings!\n\nError: %s", err.Error())))
		w.Resize(fyne.NewSize(300, 100))
		w.Show()
		return
	}

	// 2. Connect (SSE)
	var lastMessage string // Local dedup for notification
	Connect(config.InstanceURL, config.PartyLine, func(msg string) {
		// On Message Received
		if msg != lastMessage {
			a.SendNotification(fyne.NewNotification("New Rumor", msg))
			lastMessage = msg
			lastReceivedRumor = msg // Update global state
		}
	}, func(err error) {
		// On Error
		log.Println("SSE Error:", err)
	})

	a.SendNotification(fyne.NewNotification("Connected", "Listening to "+config.PartyLine))
}
