import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/procedures.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'powers.g.dart';

/// How power flows between positions and institutions, by procedure and threshold.
@JsonSerializable(includeIfNull: false)
class GovernancePowers {
  const GovernancePowers({
    required this.createdAt,
    this.deletedAt,
    required this.fromId,
    required this.id,
    required this.isBinding,
    required this.kindTerm,
    this.procedureId,
    this.provisionId,
    this.step,
    this.thresholdTerm,
    required this.toId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromId;
  final String id;
  final bool isBinding;
  final String kindTerm;
  final String? procedureId;
  final String? provisionId;
  final int? step;
  final String? thresholdTerm;
  final String toId;
  final DateTime updatedAt;
  final int version;

  factory GovernancePowers.fromJson(Map<String, dynamic> json) => _$GovernancePowersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePowersToJson(this);
}
