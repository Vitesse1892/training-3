import { test, expect } from '@playwright/test'

test.describe('Edit Training Session Tests', () => {
  let sessionId
  let sessionTitle

  test.beforeEach(async ({ page }) => {
    // First login
    await page.goto('http://localhost:5173/login');
    await page.getByLabel('Username *').fill('joel');
    await page.getByLabel('Password *').fill('grimberg');
    await page.getByRole('button', { name: 'Sign in to your account' }).click();
    // Ensure logged-in UI state is active in header (link with ARIA label)
    await expect(page.getByRole('banner').getByRole('link', { name: 'You are logged in - click to logout' })).toBeVisible();
    
    // Navigate to the list page
    await page.goto('/list')
    
    // Wait for the page to load - use specific heading level to avoid strict mode
    await expect(page.getByRole('heading', { name: 'Training Sessions', level: 1 })).toBeVisible()
    
    // Create a unique session to edit
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    sessionTitle = `Edit Test Session ${timestamp}-${randomId}`
    
    // Click add button
    await page.click('[aria-label="Add new training session"]')
    await expect(page).toHaveURL('/add')
    
    // Fill out the form
    await page.getByLabel('Session Title *').fill(sessionTitle)
    await page.getByLabel('Description *').fill('This session will be edited')
    await page.getByLabel('Status *').selectOption('Pending')
    await page.getByLabel('Duration (hours)').fill('1.5')
    
    // Submit form
    await page.getByRole('button', { name: 'Create training session' }).click()
    
    // Should navigate back to list
    await expect(page).toHaveURL('/list')
    
    // Wait for the session to appear and use ARIA-based selector
    const list = page.getByRole('list', { name: 'Training sessions' })
    await expect(list).toBeVisible()
    const sessionItem = list.getByRole('listitem').filter({ hasText: sessionTitle }).first()
    await expect(sessionItem).toBeVisible()
    
    // Click on the title button to navigate to edit page
    const titleButton = sessionItem.getByRole('button', { name: new RegExp(`^Edit training session: ${sessionTitle}$`) })
    await expect(titleButton).toBeVisible()
    await titleButton.click()
    
    // Wait for navigation to edit page - use specific heading level to avoid strict mode
    await expect(page.getByRole('heading', { name: 'Edit Training Session', level: 1 })).toBeVisible()
  })

  test('should display edit form with proper ARIA roles', async ({ page }) => {
    // Check main page structure - use specific heading level to avoid strict mode
    await expect(page.getByRole('heading', { name: 'Edit Training Session', level: 1 })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()
    
    // Check form structure
    const form = page.getByRole('form')
    await expect(form).toBeVisible()
    await expect(form).toHaveAttribute('aria-labelledby', 'edit-form-heading')
    
    // Check form heading (visually hidden but accessible)
    await expect(page.getByRole('heading', { name: 'Edit Training Session Form' })).toBeVisible()
    
    // Check navigation
    const nav = page.getByRole('navigation', { name: 'Page navigation' })
    await expect(nav).toBeVisible()
    
    const backButton = page.getByRole('button', { name: 'Go back to training sessions list (cancel)' })
    await expect(backButton).toBeVisible()
  })

  test('should display form fields with proper labels and ARIA attributes', async ({ page }) => {
    // Check title field
    const titleLabel = page.getByLabel('Session Title *')
    await expect(titleLabel).toBeVisible()
    await expect(titleLabel).toHaveAttribute('aria-describedby', 'title-help')
    await expect(titleLabel).toHaveAttribute('aria-required', 'true')
    
    // Use ARIA-describedby to find help text
    const titleHelpId = await titleLabel.getAttribute('aria-describedby')
    const titleHelp = page.locator(`#${titleHelpId}`)
    await expect(titleHelp).toBeVisible()
    
    // Check description field
    const descriptionLabel = page.getByLabel('Description *')
    await expect(descriptionLabel).toBeVisible()
    await expect(descriptionLabel).toHaveAttribute('aria-describedby', 'description-help')
    await expect(descriptionLabel).toHaveAttribute('aria-required', 'true')
    
    // Use ARIA-describedby to find help text
    const descriptionHelpId = await descriptionLabel.getAttribute('aria-describedby')
    const descriptionHelp = page.locator(`#${descriptionHelpId}`)
    await expect(descriptionHelp).toBeVisible()
    
    // Check status field
    const statusLabel = page.getByLabel('Status *')
    await expect(statusLabel).toBeVisible()
    await expect(statusLabel).toHaveAttribute('aria-describedby', 'status-help')
    await expect(statusLabel).toHaveAttribute('aria-required', 'true')
    
    // Use ARIA-describedby to find help text
    const statusHelpId = await statusLabel.getAttribute('aria-describedby')
    const statusHelp = page.locator(`#${statusHelpId}`)
    await expect(statusHelp).toBeVisible()
    
    // Check duration field
    const durationLabel = page.getByLabel('Duration (hours)')
    await expect(durationLabel).toBeVisible()
    await expect(durationLabel).toHaveAttribute('aria-describedby', 'duration-help')
    
    // Use ARIA-describedby to find help text
    const durationHelpId = await durationLabel.getAttribute('aria-describedby')
    const durationHelp = page.locator(`#${durationHelpId}`)
    await expect(durationHelp).toBeVisible()
  })

  test('should display form actions with proper ARIA roles', async ({ page }) => {
    // Check form actions group
    const formActions = page.getByRole('group', { name: 'Form actions' })
    await expect(formActions).toBeVisible()
    
    // Check save button
    const saveButton = page.getByRole('button', { name: 'Save changes to training session' })
    await expect(saveButton).toBeVisible()
    
    // Check delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await expect(deleteButton).toBeVisible()
  })

  test('should load existing session data into form fields', async ({ page }) => {
    // Check that form fields are populated with session data
    const titleInput = page.getByLabel('Session Title *')
    await expect(titleInput).toHaveValue(sessionTitle)
    
    // Check that the form is editable
    await titleInput.fill('Updated Title')
    await expect(titleInput).toHaveValue('Updated Title')
  })

  test('should update session when form is submitted', async ({ page }) => {
    // Update the title with a unique name
    const newTitle = `Updated Training Session ${Date.now()}`
    const titleInput = page.getByLabel('Session Title *')
    await titleInput.fill(newTitle)
    
    // Submit the form
    const saveButton = page.getByRole('button', { name: 'Save changes to training session' })
    await saveButton.click()
    
    // Should navigate back to list page - use specific heading level
    await expect(page.getByRole('heading', { name: 'Training Sessions', level: 1 })).toBeVisible()
    
    // Check that the updated title is visible in the list using ARIA
    const updatedSession = page.getByRole('listitem').filter({ hasText: newTitle })
    await expect(updatedSession).toBeVisible()
  })

  test('should show delete confirmation modal with proper ARIA roles', async ({ page }) => {
    // Click delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await deleteButton.click()
    
    // Check that first confirmation modal appears
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal).toHaveAttribute('aria-modal', 'true')
    
    // Check modal heading and description - look for the actual text content
    await expect(page.getByRole('heading', { name: 'Confirm Delete' })).toBeVisible()
    await expect(page.locator('#delete-confirm-description')).toHaveText(new RegExp(`Are you sure you want to delete "${sessionTitle}"\\?`))
    
    // Check modal actions
    const noButton = page.getByRole('button', { name: 'Cancel deletion' })
    const yesButton = page.getByRole('button', { name: 'Yes, proceed to final confirmation' })
    
    await expect(noButton).toBeVisible()
    await expect(yesButton).toBeVisible()
  })

  test('should show final delete confirmation modal', async ({ page }) => {
    // Click delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await deleteButton.click()
    
    // Click yes on first confirmation
    const yesButton = page.getByRole('button', { name: 'Yes, proceed to final confirmation' })
    await yesButton.click()
    
    // Check that final confirmation modal appears
    const finalModal = page.getByRole('dialog')
    await expect(finalModal).toBeVisible()
    await expect(finalModal).toHaveAttribute('aria-modal', 'true')
    
    // Check final modal heading and description - look for the actual text content
    await expect(page.getByRole('heading', { name: 'Final Confirmation' })).toBeVisible()
    await expect(page.locator('#final-delete-confirm-description')).toHaveText(new RegExp(`This action cannot be undone. Are you absolutely sure you want to delete "${sessionTitle}"\\?`))
    
    // Check final modal actions
    const noButton = page.getByRole('button', { name: 'Cancel final deletion' })
    const yesButton2 = page.getByRole('button', { name: 'Yes, delete this training session permanently' })
    
    await expect(noButton).toBeVisible()
    await expect(yesButton2).toBeVisible()
  })

  test('should delete session when confirmed', async ({ page }) => {
    // Click delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await deleteButton.click()
    
    // Click yes on first confirmation
    const yesButton = page.getByRole('button', { name: 'Yes, proceed to final confirmation' })
    await yesButton.click()
    
    // Click yes on final confirmation
    const finalYesButton = page.getByRole('button', { name: 'Yes, delete this training session permanently' })
    await finalYesButton.click()
    
    // Wait for navigation to complete
    await page.waitForURL('**/list')
    
    // Should be on list page - use specific heading level
    await expect(page.getByRole('heading', { name: 'Training Sessions', level: 1 })).toBeVisible()
    
    // Check that the deleted session is no longer visible using ARIA
    const deletedSession = page.getByRole('listitem').filter({ hasText: sessionTitle })
    await expect(deletedSession).not.toBeVisible()
  })

  test('should cancel delete when no is clicked', async ({ page }) => {
    // Click delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await deleteButton.click()
    
    // Click no on first confirmation
    const noButton = page.getByRole('button', { name: 'Cancel deletion' })
    await noButton.click()
    
    // Modal should disappear
    await expect(page.getByRole('dialog')).not.toBeVisible()
    
    // Should still be on edit page - use specific heading level
    await expect(page.getByRole('heading', { name: 'Edit Training Session', level: 1 })).toBeVisible()
  })

  test('should cancel final delete when no is clicked', async ({ page }) => {
    // Click delete button
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    await deleteButton.click()
    
    // Click yes on first confirmation
    const yesButton = page.getByRole('button', { name: 'Yes, proceed to final confirmation' })
    await yesButton.click()
    
    // Click no on final confirmation
    const noButton = page.getByRole('button', { name: 'Cancel final deletion' })
    await noButton.click()
    
    // Modal should disappear
    await expect(page.getByRole('dialog')).not.toBeVisible()
    
    // Should still be on edit page - use specific heading level
    await expect(page.getByRole('heading', { name: 'Edit Training Session', level: 1 })).toBeVisible()
  })

  test('should navigate back to list when back button is clicked', async ({ page }) => {
    // Click back button
    const backButton = page.getByRole('button', { name: 'Go back to training sessions list (cancel)' })
    await backButton.click()
    
    // Should navigate back to list page - use specific heading level
    await expect(page.getByRole('heading', { name: 'Training Sessions', level: 1 })).toBeVisible()
  })

  test('should handle form validation for required fields', async ({ page }) => {
    // Clear required title field
    const titleInput = page.getByLabel('Session Title *')
    await titleInput.fill('')
    
    // Clear required description field
    const descriptionInput = page.getByLabel('Description *')
    await descriptionInput.fill('')
    
    // Try to submit form
    const saveButton = page.getByRole('button', { name: 'Save changes to training session' })
    await saveButton.click()
    
    // Should stay on edit page due to validation - use specific heading level
    await expect(page.getByRole('heading', { name: 'Edit Training Session', level: 1 })).toBeVisible()
  })

  test('should handle error states with proper ARIA attributes', async ({ page }) => {
    // Simulate an error by navigating to a non-existent session
    await page.goto('/edit/999999')
    
    // Should show error message
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByText('Failed to load training session')).toBeVisible()
    
    // Should have retry button
    const retryButton = page.getByRole('button', { name: 'Retry loading training session' })
    await expect(retryButton).toBeVisible()
  })

  test('should maintain accessibility during form interactions', async ({ page }) => {
    // Test that form fields are keyboard accessible
    const titleInput = page.getByLabel('Session Title *')
    const descriptionInput = page.getByLabel('Description *')
    const statusSelect = page.getByLabel('Status *')
    const durationInput = page.getByLabel('Duration (hours)')
    const saveButton = page.getByRole('button', { name: 'Save changes to training session' })
    const deleteButton = page.getByRole('button', { name: 'Delete this training session' })
    
    // Verify all form elements are present and accessible
    await expect(titleInput).toBeVisible()
    await expect(descriptionInput).toBeVisible()
    await expect(statusSelect).toBeVisible()
    await expect(durationInput).toBeVisible()
    await expect(saveButton).toBeVisible()
    await expect(deleteButton).toBeVisible()
    
    // Test that title input can receive focus
    await titleInput.focus()
    await expect(titleInput).toBeFocused()
  })
})
