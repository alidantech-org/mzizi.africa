import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/statistics/indicators.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'metrics.g.dart';

/// A figure calculated from indicators (a rate per 1,000); computed when `figures` is refreshed.
@JsonSerializable(includeIfNull: false)
class StatisticsMetrics {
  const StatisticsMetrics({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.denominatorId,
    this.higherIsBetter,
    required this.id,
    required this.identityKind,
    required this.isRankable,
    this.levelTerm,
    required this.numeratorId,
    this.perFactor,
    required this.topicTerm,
    this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? denominatorId;
  final bool? higherIsBetter;
  final String id;
  final SharedIdentityKind identityKind;
  final bool isRankable;
  final String? levelTerm;
  final String numeratorId;
  final double? perFactor;
  final String topicTerm;
  final String? unitId;
  final DateTime updatedAt;
  final int version;

  factory StatisticsMetrics.fromJson(Map<String, dynamic> json) => _$StatisticsMetricsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsMetricsToJson(this);
}
