package main

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type Config struct {
	InstanceURL string `json:"instanceUrl"`
	PartyLine   string `json:"partyLine"`
}

const settingsFile = "settings.json"

func LoadSettings() (*Config, error) {
	config := &Config{}
	
	// Get executable directory
	exePath, err := os.Executable()
	if err != nil {
		return nil, err
	}
	configPath := filepath.Join(filepath.Dir(exePath), settingsFile)

	data, err := os.ReadFile(configPath)
	if os.IsNotExist(err) {
		// Return default empty config if file doesn't exist
		return config, nil
	}
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(data, config)
	return config, err
}

func SaveSettings(config *Config) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	configPath := filepath.Join(filepath.Dir(exePath), settingsFile)

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(configPath, data, 0644)
}
