import { gql, useQuery } from "@apollo/client";
import { List, ListItem, ListItemButton } from "@mui/material";
import { useParams } from "react-router";

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

const Person = () => {
    const params = useParams<{ id: string }>();
    const { loading, error, data } = useQuery(GET_PERSON, {
        variables: { id: params.id },
    });

    return (
        <>
            {data &&
                <div className="person-container">
                    <h2>{data.person.name}</h2>
                    <List className="film-list">
                        {data.person.filmConnection.films.map((film: any) =>
                            <ListItem>
                                {film.title}
                            </ListItem>
                        )}

                    </List>
                </div>
            }
        </>
    )
};

export default Person;