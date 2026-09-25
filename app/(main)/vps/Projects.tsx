import { ProjectCard } from '~/app/(main)/vps/ProjectCard'
import { getSettings } from '~/sanity/queries'
import { type Project } from '~/sanity/schemas/project'

type ProjectStatus = '本站在用' | '推荐' | '用过'

type ProjectMeta = {
  category: string
  status: ProjectStatus
  recommendationReason: string
}

function getProjectMeta(project: Project): ProjectMeta {
  if (/dmit/i.test(project.name)) {
    return {
      category: 'VPS / 服务器',
      status: '本站在用',
      recommendationReason: '推荐理由待补充。',
    }
  }

  return {
    category: '其他服务',
    status: '推荐',
    recommendationReason: '推荐理由待补充。',
  }
}

export async function Projects() {
  const projects = (await getSettings())?.projects || []
  const groups = projects.reduce<Map<string, Project[]>>((result, project) => {
    const { category } = getProjectMeta(project)
    const group = result.get(category) ?? []
    group.push(project)
    result.set(category, group)
    return result
  }, new Map())

  return (
    <div className="space-y-16">
      {[...groups.entries()].map(([category, categoryProjects], groupIndex) => {
        const headingId = `project-group-${groupIndex}`

        return (
          <section key={category} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="mb-8 flex items-center gap-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 flex-none bg-lime-500 dark:bg-lime-400"
              />
              <span className="font-mono text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {String(groupIndex + 1).padStart(2, '0')} —
              </span>
              <span>{category}</span>
              <span
                aria-hidden="true"
                className="h-px min-w-8 flex-1 bg-zinc-200 dark:bg-zinc-800"
              />
            </h2>
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
            >
              {categoryProjects.map((project) => (
                <ProjectCard
                  project={project}
                  meta={getProjectMeta(project)}
                  key={project._id}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
