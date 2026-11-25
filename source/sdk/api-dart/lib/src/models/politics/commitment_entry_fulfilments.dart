import 'package:json_annotation/json_annotation.dart';

part 'commitment_entry_fulfilments.g.dart';

/// Commitment Entry Fulfilments
@JsonSerializable(includeIfNull: false)
class PoliticsCommitmentEntryFulfilments {
  const PoliticsCommitmentEntryFulfilments({
    this.appropriationId,
    this.billId,
    this.contractId,
    this.instrumentId,
    required this.kindTerm,
    this.projectId,
    this.recordedOn,
    required this.statusTerm,
  });
  final String? appropriationId;
  final String? billId;
  final String? contractId;
  final String? instrumentId;
  final String kindTerm;
  final String? projectId;
  final DateTime? recordedOn;
  final String statusTerm;

  factory PoliticsCommitmentEntryFulfilments.fromJson(Map<String, dynamic> json) => _$PoliticsCommitmentEntryFulfilmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCommitmentEntryFulfilmentsToJson(this);
}
