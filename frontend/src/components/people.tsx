import { gql, useQuery } from "@apollo/client";
import { List, ListItemButton, TablePagination } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const GET_PEOPLE = gql`
  query GetPeople($after: String, $first: Int, $before: String, $last: Int) {
    allPeople(after: $after, first: $first, before: $before, last: $last) {
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
      }
    }
  }
`;

const People = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const { loading, error, data, refetch } = useQuery(GET_PEOPLE, {
        variables: { after: "", before: "", first: rowsPerPage, last: rowsPerPage},
    });

    const getNextPage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        if (currentPage < page) {
            refetch({ after: data.allPeople.pageInfo.endCursor, first: rowsPerPage, before: undefined, last: undefined });
            setCurrentPage(page);
        } else {
            refetch({ before: data.allPeople.pageInfo.startCursor, last: rowsPerPage, after: undefined, first: undefined });
            setCurrentPage(page);
        }
    }

    const updateList = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const rows = parseInt(event.target.value);
        refetch({after: "", first: rows});
        setRowsPerPage(rows);
        setCurrentPage(0);
    }

    return (
        <>
            {data &&
                <>
                    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'grey' }}>
                        <List>
                            {data.allPeople.people.map((person: any, index: number) =>
                                <ListItemButton key={`person${index}`}>
                                    <Link to={`/people/${person.id}`}>{person.name}</Link>
                                </ListItemButton>
                            )}
                        </List>
                    </Box>
                    <TablePagination count={data.allPeople.totalCount} onPageChange={(event, page) => getNextPage(event, page)} page={currentPage} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => updateList(event)}/>
                </>
            }
        </>
    );
};

export default People;