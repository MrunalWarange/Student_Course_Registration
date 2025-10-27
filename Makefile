# Makefile for College Course Registration System

CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -g
TARGET = course_registration
SOURCE = course_registration.c

# Default target
all: $(TARGET)

# Build the executable
$(TARGET): $(SOURCE)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCE)

# Clean up generated files
clean:
	rm -f $(TARGET) $(TARGET).exe

# Run the program
run: $(TARGET)
	./$(TARGET)

# For Windows
run-windows: $(TARGET)
	$(TARGET).exe

# Help target
help:
	@echo "Available targets:"
	@echo "  all        - Build the program (default)"
	@echo "  clean      - Remove generated files"
	@echo "  run        - Build and run the program (Unix/Linux/Mac)"
	@echo "  run-windows- Build and run the program (Windows)"
	@echo "  help       - Show this help message"

.PHONY: all clean run run-windows help

