// مثال ساده از استفاده Styled-Components
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
