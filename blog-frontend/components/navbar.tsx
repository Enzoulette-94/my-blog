"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PenSquare, User, LogOut, ImageIcon } from "lucide-react"

export function Navbar() {
  const { user, logout, isLoading } = useAuth()

  return (
    <header className="border-b bg-primary sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/articles" className="font-bold text-lg tracking-tight text-primary-foreground">
            EnzouletteBlog
          </Link>
          <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/">Potins</Link>
          </Button>
        </div>

        <nav className="flex items-center gap-2">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link href="/articles/new">
                      <PenSquare className="h-4 w-4 mr-1" />
                      Écrire
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
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
                  <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href="/login">Connexion</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
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
