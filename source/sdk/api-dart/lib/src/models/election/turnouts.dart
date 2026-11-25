import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';

part 'turnouts.g.dart';

/// Registered and cast votes of a contest in one place, by revision.
@JsonSerializable(includeIfNull: false)
class ElectionTurnouts {
  const ElectionTurnouts({
    this.cast,
    this.collectionId,
    required this.contestId,
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    this.registered,
    this.rejected,
    required this.revision,
    this.spoilt,
    required this.status,
    this.supersedesId,
    required this.updatedAt,
    this.valid,
    required this.version,
  });
  final int? cast;
  final String? collectionId;
  final String contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final int? registered;
  final int? rejected;
  final int revision;
  final int? spoilt;
  final SharedFigureStatus status;
  final String? supersedesId;
  final DateTime updatedAt;
  final int? valid;
  final int version;

  factory ElectionTurnouts.fromJson(Map<String, dynamic> json) => _$ElectionTurnoutsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionTurnoutsToJson(this);
}
