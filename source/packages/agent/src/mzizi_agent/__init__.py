"""Agent support. Model output is a proposal with its method, inputs and attribution; it is never canonical truth."""
from .proposals import Proposal, ProposalStatus
from .providers import ModelProvider, ModelRequest, ModelResponse, StaticProvider
from .tools import Tool, ToolRegistry

__all__ = ["ModelProvider", "ModelRequest", "ModelResponse", "Proposal", "ProposalStatus", "StaticProvider", "Tool", "ToolRegistry"]
__version__ = "0.1.0"
