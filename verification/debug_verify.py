from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        try:
            print("Navigating to login page...")
            page.goto("http://localhost:3000/login")

            # Print head content to check for styles
            head_html = page.evaluate("document.head.innerHTML")
            print("Head content:")
            print(head_html[:500] + "...") # Print first 500 chars

            # Check if any style tag contains "tailwindcss" or "bg-gray-100"
            content = page.content()
            if "bg-gray-100" in content:
                print("Found bg-gray-100 class in HTML")
            else:
                print("Did not find bg-gray-100 class in HTML")

            print("Taking screenshot of login page...")
            page.screenshot(path="verification/login_page.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
