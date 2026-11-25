import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/governance/institutions.dart';
import 'package:mzizi_api/src/models/governance/office_terms.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'sittings.g.dart';

/// One sitting of a house or committee.
@JsonSerializable(includeIfNull: false)
class LegislatureSittings {
  const LegislatureSittings({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.institutionId,
    required this.kindTerm,
    this.occurrenceId,
    this.sequence,
    this.session,
    this.termId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String institutionId;
  final String kindTerm;
  final String? occurrenceId;
  final int? sequence;
  final String? session;
  final String? termId;
  final DateTime updatedAt;
  final int version;

  factory LegislatureSittings.fromJson(Map<String, dynamic> json) => _$LegislatureSittingsFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureSittingsToJson(this);
}
