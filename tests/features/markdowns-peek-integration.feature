Feature: MarkdownsPeek Integration

  As a developer
  I want to test how the library integrates with other components
  So that it works well in real-world scenarios

  Scenario: Multiple instances integration test
    Given I have multiple MarkdownsPeek instances on the same page
    When I initialize all instances simultaneously
    Then each instance should have unique prefixes
    And they should not interfere with each other

  Scenario: DOM manipulation integration test
    Given I have a MarkdownsPeek instance
    When I manipulate the DOM after initialization
    Then the library should handle DOM changes gracefully
    And it should not break functionality

  Scenario: Event handling integration test
    Given I have a MarkdownsPeek instance
    When I trigger various DOM events
    Then the library should respond to events correctly
    And event listeners should be properly managed

  Scenario: Style integration test
    Given I have a MarkdownsPeek instance
    When external styles are applied to the page
    Then the library styles should not conflict
    And the component should remain functional 