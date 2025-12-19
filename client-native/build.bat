@echo off
go version
go clean
go mod download
go build -ldflags "-s -w -H=windowsgui" -o "Rumor Party Line.exe"