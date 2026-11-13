"""Every CLI command, declared as data."""

from mzizi_engine.devcli.catalog import extract, misc, web
from mzizi_engine.devcli.catalog.models import GROUP_HELP, Arg, ArgKind, Command, PayloadBuilder

COMMANDS: tuple[Command, ...] = (*extract.COMMANDS, *web.COMMANDS, *misc.COMMANDS)

__all__ = ["COMMANDS", "GROUP_HELP", "Arg", "ArgKind", "Command", "PayloadBuilder"]
