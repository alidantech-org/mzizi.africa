"""
Procurement models package

This package contains models for the complete procurement lifecycle:
- Tenders: Procurement opportunities and requirements
- Bids: Supplier responses to tenders
- Contracts: Legal agreements awarded to suppliers

These models follow the recommended architecture with:
- Code-based foreign key resolution for business logic
- Nullable foreign keys for data integrity
- Clear separation of concerns between procurement stages
"""

from .tenders import Tenders, TenderTypeEnum, ProcurementMethodEnum, TenderStatusEnum
from .bids import Bids, BidStatusEnum
from .contracts import Contracts, ContractStatusEnum

__all__ = [
    "Tenders",
    "TenderTypeEnum",
    "ProcurementMethodEnum",
    "TenderStatusEnum",
    "Bids",
    "BidStatusEnum",
    "Contracts",
    "ContractStatusEnum",
]
