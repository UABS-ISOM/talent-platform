import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export const useAddCourseMutation = () =>
  useMutation(gql`
    mutation Mutation($name: String!, $description: String!) {
      addCourse(name: $name, description: $description) {
        id
        name
        description
      }
    }
  `);
