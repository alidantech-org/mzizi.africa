/// Typed route registry for the Governance group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class GovernanceEndpoints {
  const GovernanceEndpoints();

  /// GET /v1/governance/institutions
  String get browseInstitutions => '/v1/governance/institutions';

  /// GET /v1/governance/institutions/{institutionId}
  String getInstitution({required String institutionId}) => '/v1/governance/institutions/$institutionId';

  /// GET /v1/governance/offices/{officeId}
  String getOffice({required String officeId}) => '/v1/governance/offices/$officeId';
}
