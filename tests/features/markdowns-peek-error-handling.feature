Feature: MarkdownsPeek Error Handling

  As a developer
  I want the library to handle errors gracefully
  So that the application doesn't crash when something goes wrong

  Scenario: Handle invalid container ID
    Given I have an invalid container ID
    When I initialize MarkdownsPeek with invalid container
    Then the library should handle the error gracefully
    And the error should be logged appropriately

  Scenario: Handle network errors
    Given I have a valid MarkdownsPeek instance
    When a network error occurs during file loading
    Then the library should display an error message
    And the error should be user-friendly 