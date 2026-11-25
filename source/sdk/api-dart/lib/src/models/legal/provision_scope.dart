import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'provision_scope.g.dart';

/// Provision Scope
@JsonSerializable(includeIfNull: false)
class LegalProvisionScope {
  const LegalProvisionScope({required this.instrumentId, this.limit, this.offset});
  final String instrumentId;
  final int? limit;
  final int? offset;

  factory LegalProvisionScope.fromJson(Map<String, dynamic> json) => _$LegalProvisionScopeFromJson(json);

  Map<String, dynamic> toJson() => _$LegalProvisionScopeToJson(this);
}
