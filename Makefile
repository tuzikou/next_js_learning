.PHONY: all install

# Default target - start the development server on port 3000
all:
	npx next dev -p 3000

# Install dependencies
install:
	npm install
