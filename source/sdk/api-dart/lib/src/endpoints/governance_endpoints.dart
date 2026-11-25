/// Typed route registry for the Governance group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class GovernanceEndpoints {
  const GovernanceEndpoints();

  /// GET /v1/governance/institutions/{code}
  String getInstitution({required String code}) => '/v1/governance/institutions/$code';

  /// GET /v1/governance/offices/{code}
  String getOffice({required String code}) => '/v1/governance/offices/$code';

  /// GET /v1/governance/institutions
  String get listInstitutions => '/v1/governance/institutions';

  /// GET /v1/governance/members
  String get listMembers => '/v1/governance/members';

  /// GET /v1/governance/offices
  String get listPlaceOffices => '/v1/governance/offices';

  /// GET /v1/governance/powers
  String get listPowers => '/v1/governance/powers';
}
