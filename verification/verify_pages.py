from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to login page...")
            page.goto("http://localhost:3000/login")
            print("Taking screenshot of login page...")
            page.screenshot(path="verification/login_page.png")

            print("Navigating to register page...")
            page.goto("http://localhost:3000/register")
            print("Taking screenshot of register page...")
            page.screenshot(path="verification/register_page.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
