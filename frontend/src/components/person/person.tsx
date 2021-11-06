import { gql, useQuery } from "@apollo/client";
import { Button, Card, Grid, List, ListItem } from "@mui/material";
import { useHistory, useParams } from "react-router";
import Loader from "../loader/loader";

const GET_PERSON = gql`
    query GetPerson($id: ID) {
	person(id: $id) {
        name
        filmConnection {
            films {
                title
            }
        }
    }
  }
`

type Film = {
    title: string
}

type PersonProps = {
    isCrawlActive: boolean,
    setIsCrawlActive: (isActive: boolean) => void;
}

const Person = ({ isCrawlActive, setIsCrawlActive }: PersonProps) => {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const { loading, data } = useQuery(GET_PERSON, {
        variables: { id: params.id },
    });

    const addCrawlAnimation = () => {
        setIsCrawlActive(!isCrawlActive);
    };

    const goToMainPage = () => {
        setIsCrawlActive(false);
        history.push("/people");
    };

    return (
        <div className="person-page" onClick={addCrawlAnimation}>
            {data &&
                <Grid
                    className="grid"
                    container
                    direction="column"
                    alignItems="center"
                >
                    <Grid item
                        xs={12} sm={6}
                        md={3} lg={12}
                        className={`grid-item ${isCrawlActive ? "crawl" : ""}`}
                    >
                        <h3>{data.person.name}</h3>
                        <List className="film-list">
                            {data.person.filmConnection.films.map((film: Film) =>
                                <ListItem key={film.title}>
                                    {film.title}
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Grid>
            }
            <Button variant="contained" onClick={goToMainPage} className="button">Go back</Button>
            {loading &&
                <Loader />
            }
        </div>
    )
};

export default Person;