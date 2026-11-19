import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'relationships.g.dart';

/// One directed typed relationship between exactly two Official identities, optionally with an ownership share.
@JsonSerializable(includeIfNull: false)
class OfficialRelationships {
  const OfficialRelationships({
    required this.code,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.evidenceBasisId,
    this.evidenceStatusId,
    this.fromEntityId,
    this.fromIndividualId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.kindId,
    this.sharePercentage,
    this.sourceCitationId,
    this.startsOn,
    this.toEntityId,
    this.toIndividualId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String? evidenceBasisId;
  final String? evidenceStatusId;
  final String? fromEntityId;
  final String? fromIndividualId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String kindId;
  final double? sharePercentage;
  final String? sourceCitationId;
  final DateTime? startsOn;
  final String? toEntityId;
  final String? toIndividualId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory OfficialRelationships.fromJson(Map<String, dynamic> json) => _$OfficialRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialRelationshipsToJson(this);
}
