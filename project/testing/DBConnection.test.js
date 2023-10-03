import fetchData from './DBConnection';

test('connects to DB', () => {
  expect(fetchData()).not.toBe("Error fetching data");
});
