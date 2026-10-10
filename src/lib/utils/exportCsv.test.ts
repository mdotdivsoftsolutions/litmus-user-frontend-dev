import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportToCsv } from "@/lib/utils/exportCsv";
import { formatCurrency } from "@/lib/utils/currency";

describe("exportToCsv", () => {
  let captured: Blob | null;
  const createObjectURL = vi.fn((blob: Blob) => {
    captured = blob;
    return "blob:mock";
  });
  const revokeObjectURL = vi.fn();
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    captured = null;
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => clickSpy.mockRestore());

  const readCsv = async () => (await captured!.text()).replace(/^﻿/, "");

  it("returns false and downloads nothing when there are no rows", () => {
    expect(exportToCsv("empty", [], [{ key: "a", label: "A" }])).toBe(false);
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it("writes a quoted header and rows, then cleans up the object URL and link", async () => {
    const rows = [{ id: "LIT-ORD-10002", amount: 649 }];
    const ok = exportToCsv("statement", rows, [
      { key: "id", label: "Booking" },
      { key: (r) => r.amount * 2, label: "Double" },
    ]);

    expect(ok).toBe(true);
    expect(await readCsv()).toBe('"Booking","Double"\r\n"LIT-ORD-10002","1298"');
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    expect(document.querySelectorAll("a[download]")).toHaveLength(0);
  });

  it("starts with a UTF-8 BOM so Excel reads ₹ correctly", async () => {
    exportToCsv("x", [{ a: "₹649" }], [{ key: "a", label: "A" }]);
    const bytes = new Uint8Array(await captured!.arrayBuffer());
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
  });

  it("escapes quotes, serialises objects and blanks null values", async () => {
    exportToCsv("x", [{ a: 'He said "hi"', b: { n: 1 }, c: null }], [
      { key: "a", label: "A" },
      { key: "b", label: "B" },
      { key: "c", label: "C" },
    ]);
    expect((await readCsv()).split("\r\n")[1]).toBe('"He said ""hi""","{""n"":1}",""');
  });

  it("neutralises spreadsheet formulas in text but keeps negative numbers", async () => {
    exportToCsv("x", [{ a: '=HYPERLINK("http://evil")', b: "+1", c: "@SUM(A1)", d: -100 }], [
      { key: "a", label: "A" },
      { key: "b", label: "B" },
      { key: "c", label: "C" },
      { key: "d", label: "D" },
    ]);
    expect((await readCsv()).split("\r\n")[1]).toBe(`"'=HYPERLINK(""http://evil"")","'+1","'@SUM(A1)","-100"`);
  });

  it("adds the .csv extension only when missing", () => {
    const setAttr = vi.spyOn(HTMLAnchorElement.prototype, "setAttribute");
    exportToCsv("report", [{ a: 1 }], [{ key: "a", label: "A" }]);
    exportToCsv("report.csv", [{ a: 1 }], [{ key: "a", label: "A" }]);
    const names = setAttr.mock.calls.filter(([k]) => k === "download").map(([, v]) => v);
    expect(names).toEqual(["report.csv", "report.csv"]);
    setAttr.mockRestore();
  });
});

describe("formatCurrency (INR)", () => {
  it("formats rupees with Indian digit grouping", () => {
    expect(formatCurrency(1072600)).toBe("₹10,72,600.00");
    expect(formatCurrency(649)).toBe("₹649.00");
  });
});
