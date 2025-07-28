Feature: MarkdownsPeek Methods

  As a developer
  I want to use various methods of the MarkdownsPeek library
  So that I can control the behavior programmatically

  Scenario: Test setRepository method
    Given I have a MarkdownsPeek instance
    When I call setRepository with new parameters
    Then the repository should be updated correctly
    And the owner and repo should be set

  Scenario: Test refresh method
    Given I have a MarkdownsPeek instance
    When I call the refresh method
    Then the method should be available
    And it should not throw an error

  Scenario: Test destroy method
    Given I have a MarkdownsPeek instance
    When I call the destroy method
    Then the method should be available
    And it should clean up resources 