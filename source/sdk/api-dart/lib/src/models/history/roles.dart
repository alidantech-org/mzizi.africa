import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/history/occurrences.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'roles.g.dart';

/// Who and what took part in a historical occurrence, and how.
@JsonSerializable(includeIfNull: false)
class HistoryRoles {
  const HistoryRoles({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityId,
    required this.occurrenceId,
    required this.roleTerm,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String identityId;
  final String occurrenceId;
  final String roleTerm;
  final DateTime updatedAt;
  final int version;

  factory HistoryRoles.fromJson(Map<String, dynamic> json) => _$HistoryRolesFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryRolesToJson(this);
}
