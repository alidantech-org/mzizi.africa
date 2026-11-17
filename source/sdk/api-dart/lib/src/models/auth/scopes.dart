import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/created.dart';

part 'scopes.g.dart';

/// Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group.
@JsonSerializable(includeIfNull: false)
class AuthScopes {
  const AuthScopes({
    this.countryRefId,
    required this.createdAt,
    this.datasetRefId,
    this.fieldGroup,
    this.geographicUnitRefId,
    required this.id,
    required this.includeDescendants,
    required this.institutionRefId,
    required this.isGlobal,
    required this.scopeHash,
  });
  final String? countryRefId;
  final DateTime createdAt;
  final String? datasetRefId;
  final String? fieldGroup;
  final String? geographicUnitRefId;
  final String id;
  final bool includeDescendants;
  final String institutionRefId;
  final bool isGlobal;
  final String scopeHash;

  factory AuthScopes.fromJson(Map<String, dynamic> json) => _$AuthScopesFromJson(json);

  Map<String, dynamic> toJson() => _$AuthScopesToJson(this);
}
