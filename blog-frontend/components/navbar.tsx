"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, PenSquare, User, LogOut, ImageIcon } from "lucide-react"

export function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/articles" className="font-bold text-lg tracking-tight">
            Blog
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Potins</Link>
          </Button>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Changer le thème"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Button asChild variant="default" size="sm">
                    <Link href="/articles/new">
                      <PenSquare className="h-4 w-4 mr-1" />
                      Écrire
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-1" />
                        {user.email.split("@")[0]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/photos">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Mes photos
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Connexion</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Inscription</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
