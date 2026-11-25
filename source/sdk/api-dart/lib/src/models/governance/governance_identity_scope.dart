import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'governance_identity_scope.g.dart';

/// Governance Identity Scope
@JsonSerializable(includeIfNull: false)
class GovernanceGovernanceIdentityScope {
  const GovernanceGovernanceIdentityScope({required this.identityId, this.limit, this.offset});
  final String identityId;
  final int? limit;
  final int? offset;

  factory GovernanceGovernanceIdentityScope.fromJson(Map<String, dynamic> json) => _$GovernanceGovernanceIdentityScopeFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceGovernanceIdentityScopeToJson(this);
}
