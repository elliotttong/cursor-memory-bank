import time
import re
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import subprocess
import sys
from datetime import datetime


class ChromeExtensionScraper:
    def __init__(self, search_term, max_extensions=None):
        self.search_term = search_term
        self.max_extensions = max_extensions
        self.base_url = "https://chromewebstore.google.com"
        self.search_url = f"{self.base_url}/search/{search_term}?itemTypes=EXTENSION&minimalRating=4"
        self.extensions_data = []
        self.setup_driver()
    
    def setup_driver(self):
        """Set up the Chrome WebDriver with necessary options."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-notifications")
        
        # Initialize the WebDriver with ChromeDriverManager
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
    
    def get_extension_links(self):
        """Get links to all extension detail pages."""
        print(f"Searching for extensions: {self.search_term}")
        self.driver.get(self.search_url)
        extension_links = []
        
        # Keep clicking "Load more" until we have enough extensions or there's no more to load
        while True:
            # Wait for the search results to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/detail/']"))
            )
            
            # Get all the extension links on the current page
            links = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/detail/']")
            for link in links:
                href = link.get_attribute("href")
                if href and "/detail/" in href and href not in extension_links:
                    extension_links.append(href)
            
            # Check if we have enough extensions
            if self.max_extensions and len(extension_links) >= self.max_extensions:
                extension_links = extension_links[:self.max_extensions]
                break
            
            # Try to click "Load more" button
            try:
                load_more_button = WebDriverWait(self.driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Load more')]/ancestor::button"))
                )
                self.driver.execute_script("arguments[0].click();", load_more_button)
                time.sleep(3)  # Wait for new extensions to load
            except TimeoutException:
                print("No more extensions to load or 'Load more' button not found")
                break
        
        print(f"Found {len(extension_links)} extension links")
        return extension_links
    
    def scrape_extension_details(self, url):
        """Scrape details from an extension's page."""
        print(f"Scraping extension details: {url}")
        self.driver.get(url)
        
        # Wait for the page to load
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        )
        
        try:
            # Get the extension name
            name = self.driver.find_element(By.TAG_NAME, "h1").text
            
            # Get the extension details
            extension_data = {
                "name": name,
                "url": url,
                "website_url": self.get_extension_website(),
                "featured": self.get_featured_status(),
                "rating": self.get_rating(),
                "num_reviews": self.get_num_reviews(),
                "num_users": self.get_num_users(),
                "version": self.get_version(),
                "size": self.get_size(),
                "developer": self.get_developer(),
                "updated_date": self.get_updated_date(),
                "num_languages": self.get_num_languages(),
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            print(f"Scraped data for: {name}")
            print(f"  Rating: {extension_data['rating']}")
            print(f"  Reviews: {extension_data['num_reviews']}")
            print(f"  Users: {extension_data['num_users']}")
            print(f"  Website: {extension_data['website_url']}")
            
            return extension_data
        
        except Exception as e:
            print(f"Error scraping extension details: {str(e)}")
            return None
    
    def get_extension_website(self):
        """Get the extension's website URL if available."""
        try:
            # Target the specific class for website
            website_elements = self.driver.find_elements(By.CSS_SELECTOR, "a.cJI8ee[href^='http']")
            if website_elements:
                for element in website_elements:
                    url = element.get_attribute("href")
                    if url and "chrome.google.com" not in url and "support.google.com" not in url:
                        return url
            
            # Fall back to other methods
            website_selectors = [
                "a.Gztlsc[href^='http']",   # Secondary website link
                "a[href^='http']:not([href*='chrome.google.com']):not([href*='support.google.com'])"  # Any non-Google link
            ]
            
            for selector in website_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        url = element.get_attribute("href")
                        if url and "chrome.google.com" not in url and "support.google.com" not in url:
                            return url
                except NoSuchElementException:
                    continue
            
            # Try using XPath with specific text patterns
            xpath_expressions = [
                "//a[starts-with(@href, 'http') and not(contains(@href, 'chrome.google.com')) and not(contains(@href, 'support.google.com'))]",
                "//a[contains(@class, 'cJI8ee') or contains(@class, 'Gztlsc')]"
            ]
            
            for xpath in xpath_expressions:
                try:
                    elements = self.driver.find_elements(By.XPATH, xpath)
                    for element in elements:
                        url = element.get_attribute("href")
                        if url and "chrome.google.com" not in url and "support.google.com" not in url:
                            return url
                except NoSuchElementException:
                    continue
            
            # Try to extract from page source using regex
            page_source = self.driver.page_source
            website_patterns = [
                r'href="(https?://(?!chrome\.google\.com)(?!support\.google\.com)[^"]+)"[^>]*>\s*([^<]+\.com|[^<]+\.org|[^<]+\.net)\s*<',
                r'"url"\s*:\s*"(https?://(?!chrome\.google\.com)(?!support\.google\.com)[^"]+)"',
                r'"website"\s*:\s*"(https?://(?!chrome\.google\.com)(?!support\.google\.com)[^"]+)"'
            ]
            
            for pattern in website_patterns:
                matches = re.findall(pattern, page_source)
                for match in matches:
                    url = match[0] if isinstance(match, tuple) else match
                    if url and "chrome.google.com" not in url and "support.google.com" not in url:
                        return url
            
            return None
        except Exception as e:
            print(f"Error getting extension website: {e}")
            return None

    def get_featured_status(self):
        """Determine if an extension is marked as 'featured' in the Chrome Web Store."""
        try:
            # Look for the actual featured badge element
            featured_badge = self.driver.find_elements(By.CSS_SELECTOR, "span.OmOMFc")
            for badge in featured_badge:
                if badge.text.strip().lower() == "featured" and badge.is_displayed():
                    return True
            # If not found, it's not featured
            return False
        except Exception as e:
            print(f"Error determining featured status: {e}")
            return False

    def get_rating(self):
        """Get the extension's rating."""
        try:
            # Target the specific class for rating
            rating_elements = self.driver.find_elements(By.CSS_SELECTOR, "span.Vq0ZA")
            if rating_elements:
                for element in rating_elements:
                    rating_text = element.text.strip()
                    try:
                        rating = float(rating_text)
                        if 0 <= rating <= 5:
                            return rating
                    except ValueError:
                        continue
            
            # Fall back to other methods if specific class didn't work
            rating_elements = self.driver.find_elements(By.CSS_SELECTOR, "[aria-label*='Average rating']")
            for element in rating_elements:
                aria_label = element.get_attribute("aria-label")
                if aria_label:
                    # Extract rating from format like "Average rating 4.2 out of 5 stars. 3.3K ratings."
                    rating_match = re.search(r'Average rating (\d+\.\d+) out of', aria_label)
                    if rating_match:
                        return float(rating_match.group(1))
            
            # Try parsing from page source
            page_source = self.driver.page_source
            rating_patterns = [
                r'<span class="Vq0ZA">(\d+\.\d+)</span>',
                r'Average rating (\d+\.\d+) out of',
                r'"aggregateRating"[^}]*"ratingValue"["\s:]+(\d+\.\d+)'
            ]
            
            for pattern in rating_patterns:
                matches = re.findall(pattern, page_source)
                if matches:
                    for match in matches:
                        try:
                            rating = float(match)
                            if 0 <= rating <= 5:
                                return rating
                        except ValueError:
                            continue
            
            return None
        except Exception as e:
            print(f"Error getting extension rating: {e}")
            return None

    def get_num_reviews(self):
        """Get the number of reviews for the extension."""
        try:
            # Target the specific class for review count
            review_elements = self.driver.find_elements(By.CSS_SELECTOR, "p.xJEoWe")
            if review_elements:
                for element in review_elements:
                    reviews_text = element.text.strip()
                    if "rating" in reviews_text.lower():
                        # Extract just the numeric part with potential K/M suffix
                        reviews_match = re.search(r'(\d+(?:\.\d+)?[KkMm]?)', reviews_text)
                        if reviews_match:
                            return self._parse_numeric_value(reviews_match.group(1))
            
            # Also check the PmmSTd class which can contain ratings
            reviews_elements = self.driver.find_elements(By.CSS_SELECTOR, "p.PmmSTd, span.PmmSTd")
            for element in reviews_elements:
                reviews_text = element.text.strip()
                if "rating" in reviews_text.lower():
                    reviews_match = re.search(r'(\d+(?:\.\d+)?[KkMm]?)', reviews_text)
                    if reviews_match:
                        return self._parse_numeric_value(reviews_match.group(1))
            
            # Fall back to other methods
            rating_elements = self.driver.find_elements(By.CSS_SELECTOR, "[aria-label*='Average rating']")
            for element in rating_elements:
                aria_label = element.get_attribute("aria-label")
                if aria_label:
                    # Extract reviews from format like "Average rating 4.2 out of 5 stars. 3.3K ratings."
                    reviews_match = re.search(r'(\d+(?:\.\d+)?[KkMm]?) ratings', aria_label)
                    if reviews_match:
                        reviews_text = reviews_match.group(1)
                        return self._parse_numeric_value(reviews_text)
            
            # Try parsing from page source with regex
            page_source = self.driver.page_source
            reviews_patterns = [
                r'<p class="xJEoWe">(\d+(?:\.\d+)?[KkMm]?)\s*ratings</p>',
                r'(\d+(?:\.\d+)?[KkMm]?)\s*ratings',
                r'<p class="[^"]*">(\d+(?:\.\d+)?[KkMm]?)\s*ratings</p>'
            ]
            
            for pattern in reviews_patterns:
                matches = re.findall(pattern, page_source, re.IGNORECASE)
                if matches:
                    for match in matches:
                        try:
                            return self._parse_numeric_value(match)
                        except ValueError:
                            continue
                            
            return None
        except Exception as e:
            print(f"Error getting extension review count: {e}")
            return None

    def get_num_users(self):
        """Get the number of users for the extension."""
        try:
            # Target the specific structure for user count
            user_elements = self.driver.find_elements(By.CSS_SELECTOR, "div.F9iKBc")
            if user_elements:
                for element in user_elements:
                    users_text = element.text.strip()
                    if "user" in users_text.lower():
                        # Extract the numeric part with potential K/M suffix or commas
                        users_match = re.search(r'(\d+(?:[,.]\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)\s*users', users_text)
                        if users_match:
                            return self._parse_numeric_value(users_match.group(1))
            
            # Try to look at text that might contain users info
            user_xpath = "//*[contains(text(), 'users')]"
            elements = self.driver.find_elements(By.XPATH, user_xpath)
            for element in elements:
                users_text = element.text.strip()
                if "user" in users_text.lower():
                    users_match = re.search(r'(\d+(?:[,.]\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)\s*users', users_text)
                    if users_match:
                        return self._parse_numeric_value(users_match.group(1))
            
            # Try other selectors
            user_selectors = [
                ".e-f-ih",                 # Users label in Chrome Web Store
                "[aria-label*='users']",    # Elements with user count in aria-label
                ".yNWQ8e"                  # Another user count class
            ]
            
            for selector in user_selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        users_text = element.text.strip()
                        if "user" in users_text.lower():
                            # Extract numeric part with potential K/M suffix
                            users_match = re.search(r'(\d+(?:[,.]\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)', users_text)
                            if users_match:
                                return self._parse_numeric_value(users_match.group(1))
                except (NoSuchElementException, ValueError):
                    continue
            
            # Look for the user count in the JSON data
            page_source = self.driver.page_source
            
            # Look for specific user count patterns in the JSON data
            user_json_patterns = [
                r'\[\"[^"]+\",[^,]+,[^,]+,[^,]+,\d+,\d+,(\d+),',  # Pattern in the JSON structure
                r',\d+,\d+,(\d+),\d+,',                           # Another JSON pattern
                r'\"users\":\"(\d+(?:\.\d+)?[KkMm]?)\"',          # JSON with "users" key
                r'\"userCount\":(\d+)'                            # JSON with "userCount" key
            ]
            
            for pattern in user_json_patterns:
                matches = re.findall(pattern, page_source)
                if matches:
                    for match in matches:
                        try:
                            count = self._parse_numeric_value(match)
                            if count and count > 100:  # Likely a real user count
                                return count
                        except ValueError:
                            continue
            
            # Look for text patterns in the page source
            user_patterns = [
                r'(\d+(?:[,.]\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)\s*users',
                r'(\d+(?:\.\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)\s*(?:\+)?\s*users',
                r'(\d+(?:\.\d+)?[KkMm]?|\d{1,3}(?:,\d{3})+)\s*(?:\+)?\s*people'
            ]
            
            for pattern in user_patterns:
                matches = re.findall(pattern, page_source, re.IGNORECASE)
                if matches:
                    for match in matches:
                        try:
                            count = self._parse_numeric_value(match)
                            if count and count > 100:  # Likely a real user count
                                return count
                        except ValueError:
                            continue
                    
            return None
        except Exception as e:
            print(f"Error getting extension user count: {e}")
            return None
    
    def _parse_numeric_value(self, text):
        """Helper method to parse numeric values with K, M notation and commas.
        
        Args:
            text: String like "3.3K", "5,000,000", "2.5M", etc.
            
        Returns:
            Integer value after processing.
        """
        if not text:
            return None
            
        # Convert to string in case we got a numeric value
        text = str(text).strip()
        
        # Remove any non-relevant text
        numeric_part = re.search(r'([\d,.]+)\s*([KkMm])?', text)
        if not numeric_part:
            return None
            
        value_str = numeric_part.group(1).replace(',', '')
        unit = numeric_part.group(2).upper() if numeric_part.group(2) else ''
        
        try:
            value = float(value_str)
            
            # Apply multiplier based on unit
            if unit == 'K':
                value *= 1000
            elif unit == 'M':
                value *= 1000000
                
            return int(value)
        except ValueError:
            return None
    
    def get_version(self):
        """Extract the extension version."""
        try:
            # Look for the Version label and get its sibling element
            version_element = self.driver.find_element(By.XPATH, "//div[contains(text(), 'Version')]/following-sibling::div")
            return version_element.text.strip()
        except NoSuchElementException:
            return None
    
    def get_size(self):
        """Extract the extension size."""
        try:
            # Look for the Size label and get its sibling element
            size_element = self.driver.find_element(By.XPATH, "//div[contains(text(), 'Size')]/following-sibling::div")
            return size_element.text.strip()
        except NoSuchElementException:
            return None
    
    def get_developer(self):
        """Extract the developer name."""
        try:
            # Look for the Developer label and get its sibling element
            developer_element = self.driver.find_element(By.XPATH, "//div[contains(text(), 'Developer')]/following-sibling::div")
            return developer_element.text.strip()
        except NoSuchElementException:
            return None
    
    def get_updated_date(self):
        """Extract the updated date."""
        try:
            # Look for the Updated label and get its sibling element
            updated_element = self.driver.find_element(By.XPATH, "//div[contains(text(), 'Updated')]/following-sibling::div")
            return updated_element.text.strip()
        except NoSuchElementException:
            return None
    
    def get_num_languages(self):
        """Extract the number of languages."""
        try:
            # Look for the Languages label and get its sibling element
            languages_element = self.driver.find_element(By.XPATH, "//div[contains(text(), 'Languages')]/following-sibling::div")
            languages_text = languages_element.text.strip()
            # Extract the number (e.g., "47" from "47 languages")
            languages_match = re.search(r"(\d+)", languages_text)
            if languages_match:
                return int(languages_match.group(1))
            return None
        except NoSuchElementException:
            return None
    
    def ensure_excel_support(self):
        """Ensure that pandas can export to Excel by installing openpyxl if needed."""
        try:
            import openpyxl
            return True
        except ImportError:
            print("Excel support requires openpyxl. Attempting to install...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl"])
                return True
            except subprocess.CalledProcessError:
                print("Failed to install openpyxl. Excel output will be disabled.")
                return False
    
    def scrape_extensions(self):
        """Main method to scrape extensions."""
        try:
            # Get all extension links
            extension_links = self.get_extension_links()
            
            # Scrape details for each extension
            for url in extension_links:
                extension_data = self.scrape_extension_details(url)
                if extension_data:
                    self.extensions_data.append(extension_data)
                time.sleep(1)  # Be nice to the server
            
            # Convert the data to a pandas DataFrame and save to CSV
            if self.extensions_data:
                df = pd.DataFrame(self.extensions_data)
                csv_filename = f"chrome_extensions_{self.search_term.replace(' ', '_')}.csv"
                df.to_csv(csv_filename, index=False)
                print(f"Saved data to {csv_filename}")
                
                # Try to save as Excel
                excel_support = self.ensure_excel_support()
                if excel_support:
                    try:
                        excel_filename = f"chrome_extensions_{self.search_term.replace(' ', '_')}.xlsx"
                        df.to_excel(excel_filename, index=False)
                        print(f"Saved data to {excel_filename}")
                    except Exception as e:
                        print(f"Could not save Excel file: {str(e)}")
            
            return self.extensions_data
            
        finally:
            # Clean up the WebDriver
            self.driver.quit()


if __name__ == "__main__":
    search_term = input("Enter search term for Chrome extensions: ")
    max_extensions = input("Enter maximum number of extensions to scrape (or press Enter for all): ")
    
    if max_extensions and max_extensions.isdigit():
        max_extensions = int(max_extensions)
    else:
        max_extensions = None
    
    scraper = ChromeExtensionScraper(search_term, max_extensions)
    extensions_data = scraper.scrape_extensions()
    
    # Print a summary of the scraped data
    print(f"\nScraped {len(extensions_data)} extensions")
    if extensions_data:
        print("\nSample data:")
        for i, ext in enumerate(extensions_data[:3], 1):
            print(f"{i}. {ext['name']} - Rating: {ext['rating']}, Reviews: {ext['num_reviews']}, Featured: {ext['featured']}") 