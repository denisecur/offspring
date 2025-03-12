// https://www.youtube.com/watch?v=wz5pgCWiqM4 
// - "Layout Components | React Design Pattern -2"
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

const Pane = styled.div`
  flex: ${(props) =>
    props.weight}; // rechtes und linkes Pane nehmen gleich viel Platz ein
`;
export const SplitScreen = ({ children, leftWeight = 1, rightWeight = 3 }) => {
  const [left, right] = children;

  return (
    <Container>
      <Pane weight={leftWeight}>{left} </Pane>
      <Pane weight={rightWeight}>{right} </Pane>
    </Container>
  );
};
