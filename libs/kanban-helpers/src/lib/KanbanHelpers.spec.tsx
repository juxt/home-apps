import { render } from '@testing-library/react';

import KanbanHelpers from './KanbanHelpers';

describe('KanbanHelpers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KanbanHelpers />);
    expect(baseElement).toBeTruthy();
  });
});
