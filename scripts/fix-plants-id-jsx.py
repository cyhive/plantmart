from pathlib import Path

p = Path("app/plants/[id]/page.tsx")
text = p.read_text(encoding="utf-8")

start = text.find("          {/* Seller Details Section */}")
end = text.find("      {/* Checkout Preview Overlay */}")
if start == -1 or end == -1:
    raise SystemExit(f"markers not found start={start} end={end}")

replacement = """                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      """

new_text = text[:start] + replacement + text[end:]
p.write_text(new_text, encoding="utf-8")
print("patched seller section and closings")
