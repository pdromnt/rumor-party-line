package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

func CreateSettingsWindow(a fyne.App, currentConfig *Config, lastRumor string, onSave func(Config)) fyne.Window {
	w := a.NewWindow("Rumor Party Line - Settings")
	w.Resize(fyne.NewSize(400, 260))

	// Inputs
	entryURL := widget.NewEntry()
	entryURL.SetPlaceHolder("https://rumorpartyline.example")
	entryURL.SetText(currentConfig.InstanceURL)

	entryPartyLine := widget.NewEntry()
	entryPartyLine.SetPlaceHolder("General")
	entryPartyLine.SetText(currentConfig.PartyLine)

	// Save Button
	btnSave := widget.NewButton("Save & Connect", func() {
		if entryURL.Text == "" || entryPartyLine.Text == "" {
			return // Do not connect if fields are empty
		}
		newConfig := Config{
			InstanceURL: entryURL.Text,
			PartyLine:   entryPartyLine.Text,
		}
		onSave(newConfig)
		w.Close()
	})

	displayRumor := lastRumor
	if displayRumor == "" {
		displayRumor = "N/A"
	}

	// Layout
	content := container.NewVBox(
		widget.NewLabel("Instance URL"),
		entryURL,
		widget.NewLabel("Party Line"),
		entryPartyLine,
		widget.NewSeparator(),
		widget.NewLabel("Last received rumor: "+displayRumor),
		widget.NewSeparator(),
		btnSave,
	)

	w.SetContent(content)
	w.SetCloseIntercept(func() {
		w.Hide()
	})

	return w
}
