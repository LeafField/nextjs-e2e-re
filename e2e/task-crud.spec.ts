import { test, expect } from '@playwright/test';

test('shall fetch data not visible without session token', async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto('/task-crud');
  await expect(page.getByText('Data fetching in server failed')).toBeVisible();
  await expect(page.getByText('task 1')).not.toBeVisible();
  await expect(page.getByText('task 2')).not.toBeVisible();
});

test('shall crud operation works property', async ({ page }) => {
  await page.goto('/task-crud');
  await expect(page.getByRole('heading')).toHaveText(
    'Click a title on the left to view detail !'
  );
  const initialItemNumber = 2;
  await expect(page.getByRole('listitem')).toHaveCount(initialItemNumber);
  const firstTask = page.getByRole('listitem').nth(0);
  await expect(firstTask).toHaveText('Task 1');

  await page.getByRole('textbox').fill('Task new');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('listitem')).toHaveCount(initialItemNumber + 1);
  const newTask = page.getByRole('listitem').nth(-1);
  await expect(newTask).toHaveText('Task new');

  await page.getByTestId('task-edit-icon').nth(-1).click();
  await page.getByRole('textbox').fill('Task new updated');
  await page.getByRole('button', { name: 'Update' }).click();
  const updateTask = page.getByRole('listitem').nth(-1);
  await expect(updateTask).toHaveText('Task new updated');

  await page.getByTestId('task-delete-icon').nth(-1).click();
  const tasklist = page.getByRole('listitem');
  await expect(tasklist).toHaveCount(2);

  await expect(tasklist.first().getByRole('checkbox')).not.toBeChecked();
  await tasklist.first().getByRole('checkbox').click();
  await expect(tasklist.first().getByRole('checkbox')).toBeChecked();
  await tasklist.first().getByRole('checkbox').click();
  await expect(tasklist.first().getByRole('checkbox')).not.toBeChecked();
});

test('shall task dynamic segment works property', async ({ page }) => {
  const taskId1 = '34b47953-88fd-4ffe-9fed-c365fb38a3e5';
  const taskId2 = 'c7fa6b3a-4531-4357-ac36-a13c741b66a6';
  await page.goto('task-crud');
  await expect(page.getByRole('heading')).toHaveText(
    'Click a title on the left to view detail !'
  );

  await page.getByRole('link', { name: 'Task 1' }).click();
  await page.waitForNavigation();
  expect(page.url()).toBe(`http://localhost:3000/task-crud/${taskId1}`);
  await expect(page.getByTestId('title-dynamic-segment')).toHaveText(
    `Title: Task 1`
  );

  await page.getByRole('link', { name: 'Task 2' }).click();
  await page.waitForNavigation();
  expect(page.url()).toBe(`http://localhost:3000/task-crud/${taskId2}`);
  await expect(page.getByTestId('title-dynamic-segment')).toHaveText(
    `Title: Task 2`
  );
});
