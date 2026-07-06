import getPageNumbers from "./getPageNumbers";
import { expect, test } from "vitest";

test("getPageNumbers returns correct page numbers for currentPage=1, totalPages=5", () => {
  const result = getPageNumbers(1, 5);
  expect(result).toEqual([1, 2, 3]);
});

test("getPageNumbers returns correct page numbers for currentPage=3, totalPages=5", () => {
  const result = getPageNumbers(3, 5);
  expect(result).toEqual([1, 2, 3, 4, 5]);
});

test("getPageNumbers returns correct page numbers for currentPage=5, totalPages=5", () => {
  const result = getPageNumbers(5, 5);
  expect(result).toEqual([3, 4, 5]);
});

test("getPageNumbers returns correct page numbers for currentPage=10, totalPages=20", () => {
  const result = getPageNumbers(10, 20);
  expect(result).toEqual([8, 9, 10, 11, 12]);
});

test("getPageNumbers returns correct page numbers for currentPage=1, totalPages=1", () => {
  const result = getPageNumbers(1, 1);
  expect(result).toEqual([1]);
});

test("getPageNumbers returns correct page numbers for currentPage=1, totalPages=10", () => {
  const result = getPageNumbers(1, 10);
  expect(result).toEqual([1, 2, 3]);
});

test("getPageNumbers returns correct page numbers for currentPage=10, totalPages=10", () => {
  const result = getPageNumbers(10, 10);
  expect(result).toEqual([8, 9, 10]);
});

test("getPageNumbers returns correct page numbers for currentPage=5, totalPages=3", () => {
  const result = getPageNumbers(5, 3);
  expect(result).toEqual([3]);
});
