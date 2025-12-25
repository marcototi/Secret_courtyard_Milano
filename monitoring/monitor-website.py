#!/usr/bin/env python3
"""
Script di monitoring per Secret Courtyard Milano
Esegue check di performance, uptime e sicurezza
"""

import requests
import time
import json
import sys
from datetime import datetime
from urllib.parse import urljoin

class WebsiteMonitor:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "checks": {}
        }

    def check_url(self, path, name=None):
        """Check singola URL"""
        url = urljoin(self.base_url, path)
        name = name or path

        print(f"Checking: {name} ({url})")

        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            elapsed = (time.time() - start_time) * 1000  # ms

            check_result = {
                "status": response.status_code,
                "response_time_ms": round(elapsed, 2),
                "content_length": len(response.content),
                "headers": dict(response.headers),
                "success": response.status_code == 200
            }

            # Check security headers
            check_result["security_headers"] = self.check_security_headers(response.headers)

            # Check critical content
            check_result["content_checks"] = self.check_content(response.text, path)

            print(f"  ✓ Status: {response.status_code}, Time: {elapsed:.2f}ms")

        except requests.exceptions.RequestException as e:
            check_result = {
                "status": "ERROR",
                "error": str(e),
                "success": False
            }
            print(f"  ✗ Error: {e}")

        self.results["checks"][name] = check_result
        return check_result

    def check_security_headers(self, headers):
        """Verifica presence security headers"""
        security_headers = {
            "Content-Security-Policy": headers.get("Content-Security-Policy"),
            "X-Frame-Options": headers.get("X-Frame-Options"),
            "X-Content-Type-Options": headers.get("X-Content-Type-Options"),
            "Strict-Transport-Security": headers.get("Strict-Transport-Security"),
            "Referrer-Policy": headers.get("Referrer-Policy"),
        }

        # Valutazione
        evaluation = {}
        for header, value in security_headers.items():
            evaluation[header] = {
                "present": value is not None,
                "value": value
            }

        return evaluation

    def check_content(self, content, path):
        """Check critici sul contenuto"""
        checks = {}

        # Check meta tags per SEO
        checks["has_title"] = "<title>" in content
        checks["has_meta_description"] = 'name="description"' in content
        checks["has_viewport"] = 'name="viewport"' in content

        # Check immagini
        checks["images_have_alt"] = self.check_images_have_alt(content)

        # Check links
        checks["has_canonical"] = 'rel="canonical"' in content

        return checks

    def check_images_have_alt(self, content):
        """Verifica che le immagini abbiano attributo alt"""
        # Simple check - count images with and without alt
        import re
        img_tags = re.findall(r'<img[^>]*>', content)

        if not img_tags:
            return True

        images_with_alt = 0
        for img in img_tags:
            if 'alt=' in img:
                images_with_alt += 1

        return images_with_alt / len(img_tags) > 0.8  # 80% delle immagini deve avere alt

    def run_all_checks(self):
        """Esegue tutti i check"""
        print(f"\n{'='*60}")
        print(f"Website Monitoring - {self.base_url}")
        print(f"Timestamp: {self.results['timestamp']}")
        print(f"{'='*60}\n")

        # Check pagine principali
        pages = [
            ("/", "Homepage"),
            ("/pages/la-casa.html", "La Casa"),
            ("/pages/mobilita.html", "Mobilità"),
            ("/pages/scopri-milano.html", "Scopri Milano"),
            ("/pages/la-ristrutturazione.html", "La Ristrutturazione"),
        ]

        for path, name in pages:
            self.check_url(path, name)

        # Calcola statistiche
        self.calculate_statistics()

        # Genera report
        self.generate_report()

        return self.results

    def calculate_statistics(self):
        """Calcola statistiche aggregate"""
        successful_checks = sum(1 for check in self.results["checks"].values() if check.get("success"))
        total_checks = len(self.results["checks"])

        response_times = [
            check["response_time_ms"]
            for check in self.results["checks"].values()
            if check.get("success") and "response_time_ms" in check
        ]

        self.results["statistics"] = {
            "total_checks": total_checks,
            "successful_checks": successful_checks,
            "success_rate": (successful_checks / total_checks * 100) if total_checks > 0 else 0,
            "avg_response_time_ms": sum(response_times) / len(response_times) if response_times else 0,
            "min_response_time_ms": min(response_times) if response_times else 0,
            "max_response_time_ms": max(response_times) if response_times else 0,
        }

    def generate_report(self):
        """Genera report finale"""
        stats = self.results["statistics"]

        print(f"\n{'='*60}")
        print("MONITORING REPORT")
        print(f"{'='*60}")
        print(f"Success Rate: {stats['success_rate']:.1f}% ({stats['successful_checks']}/{stats['total_checks']})")
        print(f"Avg Response Time: {stats['avg_response_time_ms']:.2f}ms")
        print(f"Min/Max Response Time: {stats['min_response_time_ms']:.2f}ms / {stats['max_response_time_ms']:.2f}ms")

        # Check critici falliti
        failed_checks = [
            name for name, check in self.results["checks"].items()
            if not check.get("success")
        ]

        if failed_checks:
            print(f"\n❌ FAILED CHECKS:")
            for check in failed_checks:
                print(f"  - {check}")

        # Security headers report
        print(f"\n🔒 SECURITY HEADERS SUMMARY:")
        for check_name, check_data in self.results["checks"].items():
            if "security_headers" in check_data:
                secure_headers = sum(1 for h in check_data["security_headers"].values() if h["present"])
                total_headers = len(check_data["security_headers"])
                print(f"  {check_name}: {secure_headers}/{total_headers} headers")

        # Salva report JSON
        report_file = f"monitoring-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump(self.results, f, indent=2)

        print(f"\n📊 Report salvato in: {report_file}")

        # Exit code basato sul success rate
        if stats["success_rate"] < 90:
            print("\n❌ Monitoring check FAILED (success rate < 90%)")
            sys.exit(1)
        else:
            print("\n✅ Monitoring check PASSED")
            sys.exit(0)

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Monitor website performance and security")
    parser.add_argument("--url", default="http://localhost:8080", help="Base URL to monitor")

    args = parser.parse_args()

    monitor = WebsiteMonitor(args.url)
    monitor.run_all_checks()