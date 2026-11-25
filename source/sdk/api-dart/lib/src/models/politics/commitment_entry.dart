import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/politics/commitment_kind.dart';
import 'package:mzizi_api/src/models/politics/commitment_entry_fulfilments.dart';

part 'commitment_entry.g.dart';

/// Commitment Entry
@JsonSerializable(includeIfNull: false)
class PoliticsCommitmentEntry {
  const PoliticsCommitmentEntry({
    required this.code,
    required this.commitmentId,
    this.dueOn,
    required this.fulfilments,
    required this.kind,
    required this.languageCode,
    this.madeOn,
    this.placeId,
    this.quantity,
    required this.statement,
    this.statusAsOf,
    required this.statusTerm,
    this.topicTerm,
  });
  final String code;
  final String commitmentId;
  final DateTime? dueOn;
  final List<PoliticsCommitmentEntryFulfilments> fulfilments;
  final PoliticsCommitmentKind kind;
  final String languageCode;
  final DateTime? madeOn;
  final String? placeId;
  final double? quantity;
  final String statement;
  final DateTime? statusAsOf;
  final String statusTerm;
  final String? topicTerm;

  factory PoliticsCommitmentEntry.fromJson(Map<String, dynamic> json) => _$PoliticsCommitmentEntryFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCommitmentEntryToJson(this);
}
