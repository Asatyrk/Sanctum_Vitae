/* Breadcrumb */

async function loadBreadcrumb() {

  const container =
    document.getElementById("site-breadcrumb")

  if (!container) return

  const response =
    await fetch("partials/breadcrumb.html")

  if (!response.ok) return

  container.innerHTML =
    await response.text()

  updateBreadcrumb()
}


function updateBreadcrumb() {

  const breadcrumb =
    document.querySelector(".breadcrumb")

  if (!breadcrumb) return

  const pageName =
    document.body.dataset.page?.trim()

  const parent =
    document.body.dataset.breadcrumbParent?.trim()

  if (!pageName) return

  const parentPages = {
    Characters: "characters.html",
    Factions: "factions.html",
    Stories: "stories.html",
    Lore: "lore.html"
  }

  let trail = []

  if (
    pageName.toLowerCase() === "home"
  ) {

    trail = [
      {
        name: "Home",
        href: "index.html"
      }
    ]

  }

  else if (
    parent &&
    parentPages[parent]
  ) {

    trail = [
      {
        name: "Home",
        href: "index.html"
      },
      {
        name: parent,
        href: parentPages[parent]
      },
      {
        name: pageName
      }
    ]

  }

  else {

    trail = [
      {
        name: "Home",
        href: "index.html"
      },
      {
        name: pageName
      }
    ]

  }

  breadcrumb.innerHTML =
    trail.map(
      (item, index) => {

        const isCurrent =
          index === trail.length - 1

        return `
          ${
            index > 0
              ? '<span class="breadcrumb-separator">/</span>'
              : ''
          }

          ${
            isCurrent
              ? `<span class="breadcrumb-current">${item.name}</span>`
              : `<a href="${item.href}">${item.name}</a>`
          }
        `

      }
    ).join("")
}


document.addEventListener(
  "DOMContentLoaded",
  loadBreadcrumb
)