Feature: MarkdownsPeek Routing with Hyphens and Spaces

  As a developer
  I want to test routing functionality with different URL formats
  So that I can ensure files are matched correctly regardless of hyphens or spaces

  Scenario: Normalize path for comparison
    Given I have a MarkdownsPeek instance
    When I normalize paths with different formats
    Then paths with hyphens should be normalized correctly
    And paths with spaces should be normalized correctly
    And paths with mixed hyphens and spaces should be normalized correctly

  Scenario: Find matching file path with exact match
    Given I have a MarkdownsPeek instance with files loaded
    When I search for a file with exact path match
    Then the correct file path should be returned

  Scenario: Find matching file path with hyphens instead of spaces
    Given I have a MarkdownsPeek instance with files loaded
    When I search for a file using hyphens in place of spaces
    Then the correct file path should be returned

  Scenario: Find matching file path with spaces instead of hyphens
    Given I have a MarkdownsPeek instance with files loaded
    When I search for a file using spaces in place of hyphens
    Then the correct file path should be returned

  Scenario: Find matching file path with mixed hyphens and spaces
    Given I have a MarkdownsPeek instance with files loaded
    When I search for a file with mixed hyphens and spaces
    Then the correct file path should be returned

  Scenario: Generate article URL path with hyphens
    Given I have a MarkdownsPeek instance with routing enabled
    When I generate URL for a file with spaces
    Then the URL should use hyphens instead of spaces
    And the URL should include the base path

  Scenario: Handle URL encoded spaces
    Given I have a MarkdownsPeek instance with files loaded
    When I search for a file with URL encoded spaces
    Then the correct file path should be returned

