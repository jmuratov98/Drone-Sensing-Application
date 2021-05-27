Navio 2
=====

Collection of drivers for Navio 2 - autopilot shield for Raspberry Pi.

## Repository structure

### Python

### Utilities

Applications and utilities for Navio.

* 3D IMU visualizer
* U-blox SPI to PTY bridge utility
* U-blox SPI to TCP bridge utility

### Cross-compilation

#### Requirements

* Install the toolchain `gcc-arm-linux-gnueabihf g++-arm-linux-gnueabihf` (`sudo apt-get install gcc-arm-linux-gnueabihf g++-arm-linux-gnueabihf` for Debian based systems)

#### Usage

* `export CXX=arm-linux-gnueabihf-g++`
* Compile the examples via `make`
