import { gql, useQuery } from "@apollo/client";
import { Button, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import  male from "../../assets/images/male.png";
import female from "../../assets/images/female.png";
import unknown from "../../assets/images/unknown.png";
import Loader from "../loader/loader";

const GET_PEOPLE = gql`
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
    const [currentCount, setCurrentCount] = useState<number>(limit);
    const [displayedPeople, setDisplayedPeople] = useState<Person[]>([]);
    const { loading, data, refetch } = useQuery(GET_PEOPLE, {
        variables: { after: "", first: 10 },
        notifyOnNetworkStatusChange: true
    });
    const history = useHistory();

    useEffect(() => {
        if (!loading && data) {
            const updatedList = displayedPeople.concat(data.allPeople.people);
            setDisplayedPeople(updatedList);
            setCurrentCount(updatedList.length);
        }
    }, [data, loading]);

    const getMore = () => {
        refetch({ after: data.allPeople.pageInfo.endCursor, first: limit });
    }

    const redirectToDetailPage = (id: string) => {
        history.push(`/people/${id}`);
    }

    const selectAvatar = (gender: Person["gender"]) => {
        if (gender === "male") {
            return male;
        } else if( gender === "female") {
            return female;
        } else {
            return unknown;
        }
    }

    return (
        displayedPeople.length > 0
            ? <div className="people-page">
                <Grid container spacing={2}>
                    {displayedPeople.map((person: Person) =>
                        <Grid item xs={12} sm={6} md={3} lg={2} data-cy="card" key={person.name}>
                            <Card className="card" onClick={() => redirectToDetailPage(person.id)} sx={{ bgcolor: "rgba(255, 255, 255, 0.4)", color: "#f9d71c" }}>
                                <h3>{person.name}</h3>
                                <img src={selectAvatar(person.gender)} alt={person.gender} />
                            </Card>
                        </Grid>
                    )}
                </Grid>
                {loading &&
                    <Loader />
                }
                {currentCount < data?.allPeople.totalCount &&
                    <Button data-cy="load-more-btn" variant="contained" onClick={getMore} className="button load-more-button">Load more</Button>
                }
            </div>
            : <></>
    );
};

export default People;