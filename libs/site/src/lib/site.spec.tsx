import { render } from '@testing-library/react';

import Site from './site';

describe('Site', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Site />);
    expect(baseElement).toBeTruthy();
  });
});
