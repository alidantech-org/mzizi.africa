import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/enums/statistics/aggregation.dart';
import 'package:mzizi_api/src/enums/statistics/frequency.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'indicators.g.dart';

/// The concept measured (Population). Its names and short definitions are `identity.names`.
@JsonSerializable(includeIfNull: false)
class StatisticsIndicators {
  const StatisticsIndicators({
    required this.aggregation,
    required this.code,
    required this.createdAt,
    this.decimals,
    this.deletedAt,
    this.frequency,
    this.higherIsBetter,
    required this.id,
    required this.identityKind,
    required this.isDerived,
    required this.kindTerm,
    this.roleTerm,
    required this.topicTerm,
    this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final StatisticsAggregation aggregation;
  final String code;
  final DateTime createdAt;
  final int? decimals;
  final DateTime? deletedAt;
  final StatisticsFrequency? frequency;
  final bool? higherIsBetter;
  final String id;
  final SharedIdentityKind identityKind;
  final bool isDerived;
  final String kindTerm;
  final String? roleTerm;
  final String topicTerm;
  final String? unitId;
  final DateTime updatedAt;
  final int version;

  factory StatisticsIndicators.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorsToJson(this);
}
