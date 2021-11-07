import { gql, useQuery } from "@apollo/client";
import { Button, Card, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import male from "../../assets/images/male.png";
import female from "../../assets/images/female.png";
import unknown from "../../assets/images/unknown.png";
import Loader from "../loader/loader";

export const GET_PEOPLE = gql`
  query GetPeople($after: String, $first: Int) {
    allPeople(after: $after, first: $first) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
      people {
        id
        name
        gender
      }
    }
  }
`;

type Person = {
    id: string,
    name: string,
    gender: "male" | "female" | "n/a" | "hermaphrodite"
}

const People = () => {
    const limit = 10;
    const { loading, data, fetchMore } = useQuery(GET_PEOPLE, {
        variables: { after: "", first: 10 },
        notifyOnNetworkStatusChange: true
    });
    const history = useHistory();

    const getMore = () => {
        fetchMore({ variables: { after: data.allPeople.pageInfo.endCursor, first: limit } });
    }

    const redirectToDetailPage = (id: string) => {
        history.push(`/people/${id}`);
    }

    const selectAvatar = (gender: Person["gender"]) => {
        switch (gender) {
            case "male":
                return male;
            case "female":
                return female;
            default:
                return unknown;
        }
    }

    return (
        <div className="people-page">
            <Grid container spacing={2} data-cy="people-container">
                {data?.allPeople.people.map((person: Person, index: number) =>
                    <Grid item xs={12} sm={6} md={3} lg={2} data-cy="card" key={person.name}>
                        <Card data-testid={`person${index}`} className="card" onClick={() => redirectToDetailPage(person.id)} sx={{ bgcolor: "rgba(255, 255, 255, 0.4)", color: "#f9d71c" }}>
                            <h3 data-cy="name">{person.name}</h3>
                            <img data-testid="avatar" src={selectAvatar(person.gender)} alt={person.gender} />
                        </Card>
                    </Grid>
                )}
            </Grid>
            {loading &&
                <Loader />
            }
            {data?.allPeople.people.length < data?.allPeople.totalCount &&
                <Button data-cy="load-more-btn" data-testid="load-more-btn" variant="contained" onClick={getMore} className="button load-more-button">Load more</Button>
            }
        </div>
    );
};

export default People;