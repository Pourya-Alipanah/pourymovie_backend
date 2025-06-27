import { PersonRole } from 'src/people/enums/person-role.enum';

/**
 * Builds a SQL query to retrieve all persons with a specific role in a title.
 * @param alias - The alias for the title in the query.
 * @param role - The role of the person (e.g., 'actor', 'director').
 * @return A SQL query string that aggregates persons with the specified role.
 */
export function buildRoleQuery(alias: string, role: PersonRole): string {
  return `(SELECT json_agg(p.*) FROM public.person p
    JOIN public.title_person tp ON tp."personId" = p.id
    WHERE tp."titleId" = ${alias}.id AND tp.role = '${role}')`;
}
